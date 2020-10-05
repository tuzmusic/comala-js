import Tag from '../../src/Tag';
import { lines } from '../createTag.test';

describe('Tag class', () => {
  describe('main functionality', () => {
    
    it('creates a tag', () => {
      const tag = new Tag('workflow');
      expect(tag.markup).toEqual(lines(['{workflow}', '{workflow}']));
    });
    
    it('can take parameters in the constructor', () => {
      const tag = new Tag('tag', { paramA: 'abc', paramB: '123' });
      expect(tag.markup).toEqual(lines([
        '{tag:parama=abc|paramb=123}', '{tag}'
      ]));
    });
    
    it('can add a parameter later', () => {
      const tag = new Tag('tag', { paramA: 'abc', paramB: '123' });
      expect(tag.markup).toEqual(lines([
        '{tag:parama=abc|paramb=123}', '{tag}'
      ]));
      tag.addParameter({ paramC: 'xyz' });
      expect(tag.markup).toEqual(lines([
        '{tag:parama=abc|paramb=123|paramc=xyz}', '{tag}'
      ]));
    });
    
    it('can be self-closing', () => {
      const tag = new Tag('tag', {}, true);
      expect(tag.markup).toEqual('{tag}');
    });
    
    it('can have text content, with any number of strings which turn into lines', () => {
      const tag = new Tag('parent');
      tag.addTextContent('line 1', 'line 2');
      
      expect(tag.markup).toEqual(lines([
        '{parent}',
        '\tline 1',
        '\tline 2',
        '{parent}',
      ]));
    });
    
    it('can add children', () => {
      const tag = new Tag('parent');
      const childTag = new Tag('child');
      tag.addChild(childTag);
      
      expect(tag.markup).toEqual(lines([
        '{parent}',
        '\t{child}',
        '\t{child}',
        '{parent}',
      ]));
    });
    
    it('can have multiple children (siblings)', () => {
      const tag = new Tag('parent');
      const childTag1 = new Tag('child1');
      const childTag2 = new Tag('child2');
      tag.addChild(childTag1);
      tag.addChild(childTag2);
      
      expect(tag.markup).toEqual(lines([
        '{parent}',
        '\t{child1}',
        '\t{child1}',
        '\t{child2}',
        '\t{child2}',
        '{parent}',
      ]));
    });
    
    it('can have nested children', () => {
      const tag = new Tag('parent');
      const childTag1 = new Tag('child1');
      const childTag2 = new Tag('child2');
      childTag1.addChild(childTag2);
      tag.addChild(childTag1);
      
      expect(tag.markup).toEqual(lines([
        '{parent}',
        '\t{child1}',
        '\t\t{child2}',
        '\t\t{child2}',
        '\t{child1}',
        '{parent}',
      ]));
    });
    
    test('markup property shows the current markup, and the tag can change any time', () => {
      const tag = new Tag('parent');
      expect(tag.markup).toEqual(lines(['{parent}', '{parent}']));
      
      // add child to parent
      const childTag1 = new Tag('child1');
      tag.addChild(childTag1);
      expect(tag.markup).toEqual(lines([
        '{parent}',
        '\t{child1}',
        '\t{child1}',
        '{parent}',
      ]));
      
      // add parameter to parent
      tag.addParameter({ newParam: 'xyz' });
      expect(tag.markup).toEqual(lines([
        '{parent:newparam=xyz}',
        '\t{child1}',
        '\t{child1}',
        '{parent}',
      ]));
      
      const childTag2 = new Tag('child2');
      
      // add child2 to child1
      childTag1.addChild(childTag2);
      // child1 updates
      expect(childTag1.markup).toEqual(lines([
        '{child1}',
        '\t{child2}',
        '\t{child2}',
        '{child1}',
      ]));
      
      // parent also updates
      expect(tag.markup).toEqual(lines([
        '{parent:newparam=xyz}',
        '\t{child1}',
        '\t\t{child2}',
        '\t\t{child2}',
        '\t{child1}',
        '{parent}',
      ]));
    });
  });
  
  describe('Full test!', () => {
    
    it('can reproduce our whole current workflow', () => {
      const finished = lines([
        '{workflow:name=JT Admin Workflow|label=controlled}',
        '\t{description}',
        '\t\tPage Created > Restrict editing to creator only',
        '\t\tAdd Reviewer > Add reviewer to editors',
        '\t\tPublish > Remove reviewer from editors (only author can edit?)',
        '\t{description}',
        '\t{trigger:pagecreated}',
        '\t\t{add-restriction:type=edit|user=@creator@}',
        '\t\t{set-message:user=@user@}',
        '\t\t\tPage created. Editing should be restricted to the creator only.',
        '\t\t{set-message}',
        '\t{trigger}',
        '\t{trigger:labeladded|label=controlled}',
        '\t\t{add-restriction:type=edit|user=@creator@}',
        '\t\t{set-message:user=@user@}',
        '\t\t\tLabel added. Editing should be restricted to the creator only.',
        '\t\t{set-message}',
        '\t{trigger}',
        '\t{comment}',
        '\t\tPut any comments here.',
        '\t\tDocs say triggers must be placed after state macros. But these seem to work.',
        '\t\tProbably because they don\'t reference any states.',
        '\t{comment}',
        '\t{state:In Progress|approved=Approved|taskable=true}',
        '\t\t{approval:Review|assignable=true}',
        '\t{state}',
        '\t{state:Approved|final=true|updated=In Progress|hideselection=true}',
        '\t{state}',
        '{workflow}',
      ]);
      
      const workflow = new Tag('workflow', { name: 'JT Admin Workflow', label: 'controlled' });
      const description = new Tag('description');
      description.addTextContent(
        'Page Created > Restrict editing to creator only',
        'Add Reviewer > Add reviewer to editors',
        'Publish > Remove reviewer from editors (only author can edit?)',
      );
      workflow.addChild(description);
      
      const pageTrigger = new Tag('trigger', { _: 'pagecreated' });
      pageTrigger.addChild(
        new Tag('add-restriction', { type: 'edit', user: '@creator@' }, true)
      );
      const pageCreatedMessage = new Tag('set-message', { user: '@user@' });
      pageCreatedMessage.addTextContent('Page created. Editing should be restricted to the creator only.');
      pageTrigger.addChild(pageCreatedMessage);
      workflow.addChild(pageTrigger);
      
      const labelTrigger = new Tag('trigger', { _: 'labeladded', label: 'controlled' });
      labelTrigger.addChild(
        new Tag('add-restriction', { type: 'edit', user: '@creator@' }, true)
      );
      const labelAddedMessage = new Tag('set-message', { user: '@user@' });
      labelAddedMessage.addTextContent('Label added. Editing should be restricted to the creator only.');
      labelTrigger.addChild(labelAddedMessage);
      workflow.addChild(labelTrigger);
      
      const comment = new Tag('comment');
      comment.addTextContent(
        'Put any comments here.',
        'Docs say triggers must be placed after state macros. But these seem to work.',
        'Probably because they don\'t reference any states.',
      );
      workflow.addChild(comment);
      
      const inProgress = new Tag('state', {
        _: 'In Progress',
        approved: 'Approved',
        taskable: 'true'
      });
      inProgress.addChild(
        new Tag('approval', { _: 'Review', assignable: 'true' }, true)
      );
      workflow.addChild(inProgress);
      
      const approved = new Tag('state', {
        _: 'Approved',
        final: 'true',
        updated: 'In Progress',
        hideSelection: 'true'
      });
      workflow.addChild(approved);
  
      expect(workflow.markup).toEqual(finished);
    });
  });
});

describe('Additional functionality', () => {
  describe('Text Content param in constructor', () => {
    it('can take a textContent parameter in place of using addTextContent', () => {
      const tag = new Tag('tag', { param: 'abc', textContent: ['line 1', 'line 2'] })
      expect(tag.markup).toEqual(lines([
        '{tag:param=abc}',
        '\tline 1',
        '\tline 2',
        '{tag}',
      ]));
    });
    
    it('can handle a single string textContent parameter', () => {
      const tag = new Tag('tag', { param: 'abc', textContent: 'line 1' })
      expect(tag.markup).toEqual(lines([
        '{tag:param=abc}',
        '\tline 1',
        '{tag}',
      ]));
      
    });
    
    it('can handle no textContent parameter', () => {
      const tag = new Tag('tag', { param: 'abc' })
      expect(tag.markup).toEqual(lines([
        '{tag:param=abc}',
        '{tag}',
      ]));
    });
  });
  
  describe('child tags in constructor', () => {
    it('can take child tags in the constructor', () => {
      const childTag1 = new Tag('child1');
      const childTag2 = new Tag('child2');
      const tag = new Tag('parent', { childTags: [childTag1, childTag2] });
      
      expect(tag.markup).toEqual(lines([
        '{parent}',
        '\t{child1}',
        '\t{child1}',
        '\t{child2}',
        '\t{child2}',
        '{parent}',
      ]));
      
    });
  });
  
});
