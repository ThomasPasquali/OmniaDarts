import { User } from '../../schemas/user.schema';
import { Club } from '../../schemas/club.schema';
import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Action } from './actions';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ClubsService } from '../clubs/clubs.service';

type Subjects = InferSubjects<typeof Club | typeof User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  async createForUser(user: User, club: Club) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.isAdmin) {
      can(Action.AddRemoveComponents, Club);
      can(Action.AddRemovePrivileges, Club);
      can(Action.AcceptRejectRequests, Club);
    } else {
      //nothing for now
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
