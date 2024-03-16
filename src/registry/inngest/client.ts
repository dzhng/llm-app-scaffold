import { EventSchemas, Inngest } from 'inngest';

import { Events } from './events';

export const inngest = new Inngest({
  id: 'aomni',
  eventKey: process.env.INNGEST_EVENT_KEY ?? 'local',
  schemas: new EventSchemas().fromRecord<Events>(),
});
