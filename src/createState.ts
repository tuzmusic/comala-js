import createTag from './createTag';

//region Event Names
const eventNames = [
  'submit',
  'updated',
  'approved',
  'expired',
  'completed',
];

const firstLetterUpper = (str: string): string => str[0].toUpperCase() + str.substring(1);
const eventHandlerNames = eventNames.map(name => 'on' + firstLetterUpper(name));

type EventName = typeof eventNames[number]
type EventHandlerName = typeof eventHandlerNames[number]
type EventHandlerParams = Record<EventName, string>
//endregion

type StateConfigKeys = EventHandlerName

type StateConfig = Partial<Record<StateConfigKeys, string>>;

export default function createState(
  name: string,
  config?: StateConfig
): string {
  
  function getHandlers(): EventHandlerParams {
    const params: EventHandlerParams = {};
    
    for (const key in config) {
      if (eventHandlerNames.includes(key)) {
        params[key.replace('on', '').toLowerCase()] = config[key];
      }
    }
    
    return params;
  }
  
  const allParams = { ...getHandlers() };
  
  return createTag(
    'state', { unnamed: name, ...allParams }
  );
}