import { User } from "../../schemas/user.schema";
import { Club } from "../../schemas/club.schema";
import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from "@casl/ability";
import { Action } from "./actions";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ClubsService } from "../clubs/clubs.service";

type Subjects = InferSubjects<typeof Club | typeof User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {

  async createForUser(user: User, club: Club) {

    const { can, cannot, build } = new AbilityBuilder<Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    console.log(club);

    const adminsOfUsersClub = club.admin;

    const isAdmin = adminsOfUsersClub.reduce( (_, next) => {
        return next._id == user._id ? next : null;
    }, null)

    if (isAdmin) {
      can(Action.AddRemoveComponents, Club);
      can(Action.AddRemovePrivileges, Club); 
    } else {
      //nothing for now
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
