import { Module } from '@nestjs/common';
import { ClubsModule } from '../clubs/clubs.module';
import { UsersModule } from '../users/users.module';
import { CaslAbilityFactory } from './casl-ability.factory';
import { PoliciesGuard } from './policies-guard.service';

@Module({
  imports: [],
  providers: [CaslAbilityFactory, PoliciesGuard],
  exports: [CaslAbilityFactory, PoliciesGuard]
})
export class CaslModule {}
