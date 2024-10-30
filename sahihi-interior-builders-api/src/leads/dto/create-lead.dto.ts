import { IsEnum, IsUUID } from 'class-validator';
import { LeadStatus } from '../entities/lead.entity';

export class CreateLeadDto {
  @IsUUID()
  customerId: string;

  @IsEnum(LeadStatus)
  status: LeadStatus;
}
