import { ParamValueType } from './declarative-api/types';
import clipboardy from 'clipboardy';

// this below is bullshit that we need to say " | Tag[]" at the end or else childTags won't work.
// eslint-disable-next-line @typescript-eslint/no-use-before-define
export type ParamType = { childTags?: Tag[] } & Record<string, ParamValueType | Tag[]>

export function lines(strs: string[]): string {
  return strs.join('\n');
}

export default class Tag {

  tagName: string;
  parameters: Record<string, string>;
  selfClosing: boolean;
  textLines: string[] = [];
  children: Tag[] = [];

  constructor(tagName: string, parameters: ParamType = {}, selfClosing: boolean = false) {
    this.tagName = tagName;

    // Get text content from parameters.
    const { textContent, childTags } = parameters;
    if (textContent) {
      // if a single textContent argument, convert to array and store
      this.textLines = typeof textContent === 'string' ? [textContent as string] : textContent as string[];
      // get rid of the parameter since we're not using it as an actual workflow param
      delete parameters['textContent'];
    }

    // Get children from parameters
    if (childTags && childTags instanceof Array && childTags.every((t: any) => t instanceof Tag)) {
      this.children = childTags as Tag[];
      // get rid of the parameter since we're not using it as an actual workflow param
      delete parameters['childTags'];
    }

    // this explicit cast is the only way to tell Typescript that
    this.parameters = parameters as Record<string, string>;
    this.selfClosing = selfClosing;
  }

  get markup() {
    const { children, tagName, parameters, selfClosing, textLines } = this;

    function getOpeningTag(): string {
      let openingTag = '{' + tagName;

      // add parameters
      for (const key in parameters) {
        openingTag += (key == Object.keys(parameters)[0] ? ':' : '|');
        if (key !== '_') openingTag += key.toLowerCase() + '=';
        openingTag += [parameters[key]].join();
      }

      return openingTag + '}';
    }

    // Opening Tag, & Parameters
    const markupLines = [getOpeningTag()];

    // Text Content
    textLines.forEach(line => markupLines.push('\t' + line));

    // Child Tags
    children.forEach(child => {
      const childLines = child.markup.split('\n');
      childLines.forEach(childLine => {
        markupLines.push('\t' + childLine);
      });
    });

    // Closing tag
    if (!selfClosing) markupLines.push(`{${ tagName }}`);

    return lines(markupLines);
  }

  getMarkup = () => {
    clipboardy.writeSync(this.markup);
    console.log(this.markup);
    console.log(this.markup.split('\n').length, 'LINES');
    console.warn('The above markup has been copied to the clipboard.');
  };

  addTextContent = (...textLines: string[]) => { this.textLines = textLines; };

  addParameters = (params: Record<string, ParamValueType>) => { Object.assign(this.parameters, params); };

  addChild = (child: Tag) => { this.children.push(child); };
}

export class SelfClosingTag extends Tag {
  constructor(name: string, params: ParamType) {
    super(name, params, true);
  }
}

export class State extends Tag {
  constructor(name: string, params: ParamType) {
    super('state', { _: name, ...params });
  }
}

export class Trigger extends Tag {
  constructor(name: string, params: ParamType) {
    super('trigger', { _: name, ...params });
  }
}

export class Approval extends SelfClosingTag {
  constructor(name: string, params: ParamType) {
    super('approval', { _: name, ...params });
  }
}

export class SetRestrictions extends SelfClosingTag {
  constructor(type: 'view' | 'edit', params: ParamType) {
    super('set-restrictions', { type, ...params });
  }
}

export class AddRestriction extends SelfClosingTag {
  constructor(type: 'view' | 'edit', params: ParamType) {
    super('add-restriction', { type, ...params });
  }
}

export class RemoveRestriction extends SelfClosingTag {
  constructor(type: 'view' | 'edit', params?: ParamType) {
    super('remove-restriction', { type, ...params });
  }
}

export class StateSelection extends SelfClosingTag {
  constructor(states: string | string[], params?: ParamType) {
    super('state-selection', { states: [states].flat().join(), ...params });
  }
}

export class SetState extends SelfClosingTag {
  constructor(state: string) {
    super('set-state', { _: state });
  }
}

export class WorkflowParameter extends Tag {
  constructor(name: string, type: 'user' | 'group' | 'string' | 'duration' | 'options', edit = true) {
    super('workflowparameter', { _: name, type, edit });
  }
}
