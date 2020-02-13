import { Pipe, PipeTransform } from '@angular/core';
import * as marked from 'marked';

/** convert text to markdown  */
@Pipe({
  name: 'markdown'
})
export class MarkdownPipe implements PipeTransform {
  public transform(value: any): any {
    if (value && value.length > 0) {
      return marked(value);
    }
    return value;
  }
}
