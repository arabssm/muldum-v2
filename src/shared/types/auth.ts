export interface GoogleLoginResponse {
    userType: 'STUDENT' | 'TEACHER';
    userId: number;
    name: string;
    teamId?: number;
    role: 'student' | 'teacher';
    accessToken: string;
    refreshToken: string;
}

export interface ErrorResponse {
    error?: string;
    message?: string;
    statusCode?: number;
}

export interface RoleProps {
    roles: Array<'STUDENT' | 'TEACHER' | string>;
    fallback?: React.ReactNode;
}