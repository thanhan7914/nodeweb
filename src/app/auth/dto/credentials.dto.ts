import { IsString, IsEmail, MaxLength, MinLength, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH, EMAIL_MAX_LENGTH } from 'src/constant/user.constant';
import { ROLES } from 'src/helpers/decorators/auth.decorator';

export class CredentialsDto {
    @ApiProperty({
        description: 'Email',
        default: 'hieuheo@gmail.com',
        example: 'hieuheo@gmail.com',
    })
    @IsString({
        message: 'メールアドレスを入力してください。',
    })
    @IsEmail(
        {},
        {
            message: '有効なメールアドレスを入力してください。',
        },
    )
    @MaxLength(EMAIL_MAX_LENGTH, {
        message: `メールアドレスの長さは${EMAIL_MAX_LENGTH}文字以内で入力してください`,
    })
    readonly email: string;

    @ApiProperty({
        description: 'Password',
        default: 'heohieu',
        example: 'heohieu',
    })
    @IsString({
        message: 'パスワードを入力してください。',
    })
    @MaxLength(PASSWORD_MAX_LENGTH, {
        message: `パスワードの長さは${PASSWORD_MAX_LENGTH}文字以内で入力してください`,
    })
    @MinLength(PASSWORD_MIN_LENGTH, {
        message: `パスワードの長さは最低${PASSWORD_MIN_LENGTH}文字で入力してください。`,
    })
    readonly password: string;

    @ApiProperty({
        description: 'User role',
        default: ROLES.USER,
        example: ROLES.USER,
        enum: ROLES,
    })
    @IsOptional()
    @IsString()
    @IsIn([ROLES.USER, ROLES.ADMIN])
    role: string = ROLES.USER;
}
