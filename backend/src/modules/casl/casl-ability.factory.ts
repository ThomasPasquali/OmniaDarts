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

    const adminsOfUsersClub = club.admin;

    const isAdmin = adminsOfUsersClub.find(u => u._id.toString() == user._id.toString())
    console.log(adminsOfUsersClub)
    console.log(user._id)

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
