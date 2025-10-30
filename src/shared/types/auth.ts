export interface GoogleLoginResponse {
    userType: 'STUDENT' | 'TEACHER';
    userId: number;
    name: string;
    teamId?: number;
    role: 'STUDENT' | 'TEACHER';
    accessToken: string;
    refreshToken?: string; // Make optional since your backend might not return it initially
}

export interface ErrorResponse {
    error?: string;
    message?: string;
    statusCode?: number;
}