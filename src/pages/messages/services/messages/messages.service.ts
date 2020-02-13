import { Injectable, Injector } from '@angular/core';
import * as firebase from 'firebase/app';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IUser } from 'src/pages/auth/helpers/model';
import { AuthService } from 'src/pages/auth/services/auth/auth.service';
import { Extender } from 'src/shared/helpers/extender';
import { FirestoreService } from 'src/shared/services/firestore/firestore.service';
import { IChat, IMessage } from '../../models/message';

/**
 * crud methods to interact with firebase cloud store regarding messaging
 */
@Injectable({
  providedIn: 'root'
})
export class MessagesService extends Extender {
  constructor(protected injector: Injector, private authService: AuthService, private firestoreService: FirestoreService) {
    super(injector);
  }

  /** get messages that contain the users uid in participantsId property, check if message is flagged as archived
   * for each message get messages recipient and get their details from users collection. return data
   */
  public getMessages(uid: string, archieved: boolean = false): Observable<IMessage[]> {
    return this.firestoreService
      .colWithIds$<IMessage[]>('messages', (ref: any) =>
        ref.where('participantsId', 'array-contains', uid).where('isArchieved', '==', archieved)
      )
      .pipe(
        switchMap((data: IMessage[]) => {
          const reads$ = [];
          if (data.length > 0) {
            data.forEach((msg) => {
              reads$.push(this.getMessage(msg.id));
            });
            return combineLatest(reads$);
          } else {
            return of([]);
          }
        }),
        map((data: IMessage[]) => {
          return data;
        })
      );
  }

  /** get message and their participants information */
  public getMessage(id: string | number): Observable<IMessage> {
    let data: any;
    const reads$ = [];

    return this.firestoreService.doc$<IMessage>(`messages/${id}`).pipe(
      switchMap((msg) => {
        data = msg;
        msg.participantsId.forEach((i: any) => {
          reads$.push(this.firestoreService.doc$<IUser>(`users/${i}`));
        });
        return combineLatest(reads$);
      }),
      map((joins) => {
        return { ...data, participants: joins };
      })
    );
  }

  /** update message */
  public updateMessage(message: IMessage) {
    return this.firestoreService.update(`messages/${message.id}`, message);
  }

  /** delete message */
  public deleteMessage(message: IMessage) {
    return this.firestoreService.delete(`messages/${message.id}`);
  }

  /** delete collection of messages */
  public deleteAllMessages(batch) {
    return this.firestoreService.deleteCollection(`messages`, batch);
  }

  /** start chat with a user by first checking if a message already exists with the users id,
   * if no message exists, create one,
   * if message exists, navigate to chat modal
   */
  public startChat(user: IUser) {
    this.firestoreService
      .colWithIds$<IMessage>('messages', (ref: any) => ref.where('participantsId', 'array-contains', user.uid))
      .subscribe((data) => {
        const message = data[0];
        if (!message) {
          this.createMessage(user);
        } else {
          this.goto(`${this.routes.messages}/${message.id}`);
        }
      });
  }

  /** delete a message in chat */
  public deleteChat(message: IMessage, data: IChat) {
    return this.firestoreService.update(`messages/${message.id}`, {
      messages: firebase.firestore.FieldValue.arrayRemove(data)
    });
  }

  /** send a message */
  public send(message: IMessage, data: IChat) {
    delete message.participants;
    return this.firestoreService.update(`messages/${message.id}`, {
      ...message,
      messages: firebase.firestore.FieldValue.arrayUnion(data)
    });
  }

  /** create a message with participants and default messages property to empty array */
  private async createMessage(user: IUser) {
    const { uid } = await this.authService.getUser();
    this.firestoreService.add<IMessage>('messages', {
      participantsId: [user.uid, uid],
      messages: [],
      isArchieved: false
    });
  }
}
