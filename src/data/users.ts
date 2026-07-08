export interface User {
    username: string;
    password: string;
}

const PASSWORD = process.env.SAUCE_PASSWORD as string

export const users = {
    standard: { username: 'standard_user', password: PASSWORD },
    lockedOut: { username: 'locked_out_user', password: PASSWORD },
    problem: { username: 'problem_user', password: PASSWORD },
    invalid: { username: 'wrong_credentials', password: 'password isnt correct' }
} satisfies Record<string, User>;

export const invalidLoginScenarios: Array<{
    description: string;
    username: string;
    password: string;
    expectedError: string;
}> = [
        {
            description: 'invalid username and password',
            username: 'wrong_credentials',
            password: 'password isnt correct',
            expectedError: 'Username and password do not match any user in this service',
        },
        {
            description: 'locked out user',
            username: 'locked_out_user',
            password: PASSWORD,
            expectedError: 'Sorry, this user has been locked out.',
        },
        {
            description: 'blank username',
            username: '',
            password: PASSWORD,
            expectedError: 'Username is required',
        },
        {
            description: 'blank password',
            username: 'standard_user',
            password: '',
            expectedError: '',
        },
    ]