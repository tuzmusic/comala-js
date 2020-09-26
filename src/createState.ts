import createTag from './createTag';

//region Transitions
const transitionNames = [
  'submit',
  'updated',
  'approved',
  'expired',
  'completed',
];

const firstLetterUpper = (str: string): string => str[0].toUpperCase() + str.substring(1);
const transitionHandlerNames = transitionNames.map(name => 'on' + firstLetterUpper(name));

type TransitionName = typeof transitionNames[number]
type TransitionHandlerName = typeof transitionHandlerNames[number]

// TODO: second parameter must be one of the states.
//   not sure we can actually enforce this in TS, but we should ultimately
//   enforce it in the app itself. Way in the future.
type TransitionHandlerParams = Record<TransitionName, string>
//endregion

//region Events
const eventNames = [
  'statechanged',
  'pagestatechanged',
  'newsstatechanged',
  'stateexpired',
];

const eventHandlerNames = eventNames.map(name =>
  'on' + firstLetterUpper(name
    .replace('state', 'State')
    .replace('expired', 'Expired')
    .replace('changed', 'Changed'))
);

type EventName = typeof eventNames[number]
type EventHandlerName = typeof eventHandlerNames[number]
type EventHandlerParams = Record<EventName, string>
//endregion

type StateConfigKeys = TransitionHandlerName

type StateConfig = Partial<Record<StateConfigKeys, string>>;

export default function createState(
  name: string,
  config?: StateConfig
): string {
  
  function getHandlers(): TransitionHandlerParams {
    const params: TransitionHandlerParams = {};
    
    for (const key in config) {
      if (transitionHandlerNames.includes(key)) {
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