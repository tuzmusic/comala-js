import Tag from '../Tag';

export default class MarkupParser {
  lines: string[];
  workflow: Tag;
  tags: Tag[];
  currentTagOpen: boolean;

  //region PARSER
  currentParent: Tag;
  previousParent: Tag;

  constructor(markdown: string) {
    const lines = markdown.split('\n');
    this.parseTag(lines);
  }

  parseTag = (tagLines: string[]) => {
    for (let i = 0; i < tagLines.length; i++) {
      const line = tagLines[i].trim();

      // if this is a closing tag, restore the prevous parent, and we're done
      if (line === `{${ this.currentParent?.tagName }}`) {
        this.currentParent = this.previousParent;
        continue;
      }

      // parse the tag
      const [opening, remainder] = line.split(':');

      // get tagname
      const tagName = opening.split('{').pop();
      const tagParams: Record<string, string> = {};

      // get each param text
      const allParams = remainder.split('}')[0].split('|');

      // construct the params object
      allParams.forEach(paramText => {
        let key, value;
        if (!paramText.includes('=')) {
          key = '_';
          value = paramText;
        } else {
          [key, value] = paramText.split('=');
        }
        tagParams[key] = value;
      });

      // if there's a corresponding closing tag AFTER this one, this line is the new current parent
      const subsequentLines = tagLines.slice(i + 1);
      const existingClosing = subsequentLines.find(line => line.trim() === `{${ tagName }}`);

      // construct the tag
      const newTag = new Tag(tagName, tagParams, !existingClosing);

      if (!this.currentParent) {
        // this.tags.push(newTag);
        this.workflow = this.currentParent = newTag;
      } else {
        this.currentParent.addChild(newTag);
      }

      // if first tag
      if (existingClosing) {
        // restore the previous parent.
        this.previousParent = this.currentParent;
        this.currentParent = newTag;
      }

    }
  };

  //endregion PARSER
}

const markup = `{workflow:name=DCR Workflow|label=dcr-test}
\t{workflowparameter:Document Manager|type=user|edit=true}
\t{workflowparameter}
\t{workflowparameter:Process Owner|type=user|edit=true}
\t{workflowparameter}
\t{state:Migration|hidefrompath=true|colour=#4A6785|approved=In Process}
\t\t{approval:Assign Roles|approvelabel=Ready|rejectlabel=Cancel|user=&@author@}
\t{state}
\t{state:In Process|requiredparams=Document Manager,Process Owner|approved=In Review}
\t\t{approval:Peer Review|approvelabel=Ready|rejectlabel=Not Ready|assignable=true|allowedassignusers=@Document Manager@,@Process Owner@,@author@|selectedapprovers=SLI Internal}
\t\t{approval:Author Review|user=&@Document Manager@,@Process Owner@,@author@}
\t{state}
\t{state:In Review|colour=#0052CC|approved=In Approval}
\t\t{approval:Peer Review|approvelabel=Ready|rejectlabel=Not Ready|assignable=true|allowedassignusers=@Document Manager@,@Process Owner@,@author@|selectedapprovers=SLI Internal}
\t\t{approval:Author Review|user=&@Document Manager@,@Process Owner@,@author@}
\t{state}
\t{state:In Approval|colour=#6554C0|approved=Published}
\t\t{approval:Manager Approval|user=&@Document Manager@}
\t\t{approval:Approval|allowedassignusers=@Document Manager@,@Process Owner@,@author@|selectedapprovers=SLI Internal}
\t{state}
\t{state:Published|final=true}
\t\t{state-selection:states=In Process|user=@Document Manager@,@Process Owner@}
\t{state}
\t{trigger:labeladded|label=dcr-test}
\t\t{set-restrictions:type=view|group=empty-group}
\t\t{set-restrictions:type=edit|user=@author@}
\t{trigger}
\t{trigger:statechanged|state=Migration}
\t\t{set-restrictions:type=view|group=empty-group}
\t\t{set-restrictions:type=edit|user=@author@}
\t{trigger}
\t{trigger:pageapprovalassigned|approval=Assign Roles|state=Migration}
\t\t{set-restrictions:type=view|group=empty-group}
\t\t{set-restrictions:type=edit|user=@author@,@approvalassignees@}
\t{trigger}
\t{trigger:approvalunassigned|approval=Assign Roles|state=Migration}
\t\t{set-restrictions:type=view|group=empty-group}
\t\t{set-restrictions:type=edit|user=@author@,@approvalassignees@}
\t{trigger}
\t{trigger:statechanged|state=In Process}
\t\t{set-restrictions:type=view|group=empty-group}
\t\t{set-restrictions:type=edit|user=@Document Manager@,@Process Owner@,@author@}
\t{trigger}
\t{trigger:pageapprovalassigned|approval=Peer Review|state=In Process}
\t\t{set-restrictions:type=view|group=empty-group}
\t\t{set-restrictions:type=edit|user=@Document Manager@,@Process Owner@,@author@,@approvalassignees@}
\t{trigger}
\t{trigger:approvalunassigned|approval=Peer Review|state=In Process}
\t\t{set-restrictions:type=view|group=empty-group}
\t\t{set-restrictions:type=edit|user=@Document Manager@,@Process Owner@,@author@,@approvalassignees@}
\t{trigger}
\t{trigger:pageapproved|approval=Author Review|state=In Process|partial=true}
\t\t{set-state:In Review}
\t{trigger}
\t{trigger:pageapprovalassigned|approval=Author Review|state=In Process}
\t\t{set-restrictions:type=view|user=@approvalassignees@}
\t\t{set-restrictions:type=edit|user=@Document Manager@,@Process Owner@,@author@,@approvalassignees@}
\t{trigger}
\t{trigger:approvalunassigned|approval=Author Review|state=In Process}
\t\t{set-restrictions:type=view|user=@approvalassignees@}
\t\t{set-restrictions:type=edit|user=@Document Manager@,@Process Owner@,@author@,@approvalassignees@}
\t{trigger}
\t{trigger:statechanged|state=In Review}
\t\t{set-restrictions:type=view|group=empty-group}
\t\t{set-restrictions:type=edit|user=@Document Manager@,@Process Owner@,@author@}
\t{trigger}
\t{trigger:pageapprovalassigned|approval=Peer Review|state=In Review}
\t\t{set-restrictions:type=view|user=@approvalassignees@}
\t\t{set-restrictions:type=edit|user=@Document Manager@,@Process Owner@,@author@}
\t{trigger}
\t{trigger:approvalunassigned|approval=Peer Review|state=In Review}
\t\t{set-restrictions:type=view|user=@approvalassignees@}
\t\t{set-restrictions:type=edit|user=@Document Manager@,@Process Owner@,@author@}
\t{trigger}
\t{trigger:pageapproved|approval=Author Review|state=In Review|partial=true}
\t\t{set-state:In Approval}
\t{trigger}
\t{trigger:pageapprovalassigned|approval=Author Review|state=In Review}
\t\t{set-restrictions:type=view|user=@approvalassignees@}
\t\t{set-restrictions:type=edit|user=@Document Manager@,@Process Owner@,@author@}
\t{trigger}
\t{trigger:approvalunassigned|approval=Author Review|state=In Review}
\t\t{set-restrictions:type=view|user=@approvalassignees@}
\t\t{set-restrictions:type=edit|user=@Document Manager@,@Process Owner@,@author@}
\t{trigger}
\t{trigger:statechanged|state=In Approval}
\t\t{set-restrictions:type=view|user=@Document Manager@,@Process Owner@,@author@}
\t\t{set-restrictions:type=edit|group=empty-group}
\t{trigger}
\t{trigger:pagerejected|approval=Manager Approval|partial=true}
\t\t{set-state:In Process}
\t\t{set-restrictions:type=view|group=empty-group}
\t\t{set-restrictions:type=edit|user=@Document Manager@,@Process Owner@,@author@}
\t{trigger}
\t{trigger:pageapprovalassigned|approval=Manager Approval|state=In Approval}
\t\t{set-restrictions:type=view|user=@Document Manager@,@Process Owner@,@author@,@approvalassignees@}
\t\t{set-restrictions:type=edit|group=empty-group}
\t{trigger}
\t{trigger:approvalunassigned|approval=Manager Approval|state=In Approval}
\t\t{set-restrictions:type=view|user=@Document Manager@,@Process Owner@,@author@,@approvalassignees@}
\t\t{set-restrictions:type=edit|group=empty-group}
\t{trigger}
\t{trigger:pagerejected|approval=Approval|partial=true}
\t\t{set-state:In Process}
\t\t{set-restrictions:type=view|group=empty-group}
\t\t{set-restrictions:type=edit|user=@Document Manager@,@Process Owner@,@author@}
\t{trigger}
\t{trigger:pageapprovalassigned|approval=Approval|state=In Approval}
\t\t{set-restrictions:type=view|user=@Document Manager@,@Process Owner@,@author@,@approvalassignees@}
\t\t{set-restrictions:type=edit|group=empty-group}
\t{trigger}
\t{trigger:approvalunassigned|approval=Approval|state=In Approval}
\t\t{set-restrictions:type=view|user=@Document Manager@,@Process Owner@,@author@,@approvalassignees@}
\t\t{set-restrictions:type=edit|group=empty-group}
\t{trigger}
\t{trigger:statechanged|state=Published}
\t\t{set-restrictions:type=view|group=SLI Internal}
\t\t{set-restrictions:type=edit|group=empty-group}
\t{trigger}
{workflow}`;
const parsed = new MarkupParser(markup);
console.log(parsed.workflow.markup);
console.log(parsed.workflow.markup.split('\n').length, 'LINES');
