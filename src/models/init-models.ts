import type { Sequelize } from "sequelize";
import { Feedback as _Feedback } from "./feedback";
import type { FeedbackAttributes, FeedbackCreationAttributes } from "./feedback";
import { Subscriber as _Subscriber } from "./subscriber";
import type { SubscriberAttributes, SubscriberCreationAttributes } from "./subscriber";
import { User as _User } from "./user";
import type { UserAttributes, UserCreationAttributes } from "./user";

export {
  _Feedback as Feedback,
  _Subscriber as Subscriber,
  _User as User,
};

export type {
  FeedbackAttributes,
  FeedbackCreationAttributes,
  SubscriberAttributes,
  SubscriberCreationAttributes,
  UserAttributes,
  UserCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const Feedback = _Feedback.initModel(sequelize);
  const Subscriber = _Subscriber.initModel(sequelize);
  const User = _User.initModel(sequelize);


  return {
    Feedback: Feedback,
    Subscriber: Subscriber,
    User: User,
  };
}
