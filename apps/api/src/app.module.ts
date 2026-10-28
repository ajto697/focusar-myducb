import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { GoalsModule } from './modules/goals/goals.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { EventsModule } from './modules/events/events.module';
import { AIModule } from './modules/ai/ai.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    GoalsModule,
    TasksModule,
    SessionsModule,
    EventsModule,
    AIModule,
    RoomsModule,
    ReportsModule,
  ],
})
export class AppModule {}
