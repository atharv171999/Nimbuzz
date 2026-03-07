import fs from 'fs';
import path from 'path';

export interface User {
    id: string;
    name?: string;
    email: string;
    password?: string;
}

const usersFilePath = path.join(process.cwd(), 'users.json');

export async function getUsers(): Promise<User[]> {
    try {
        const data = await fs.promises.readFile(usersFilePath, 'utf8');
        return JSON.parse(data) as User[];
    } catch (error) {
        if ((error as any).code === 'ENOENT') {
            // If file does not exist, initialize it
            await fs.promises.writeFile(usersFilePath, '[]');
            return [];
        }
        console.error('Error reading users from mock database:', error);
        return [];
    }
}

export async function getUser(email: string): Promise<User | undefined> {
    const users = await getUsers();
    return users.find((user) => user.email === email);
}

export async function createUser(user: User): Promise<void> {
    const users = await getUsers();
    users.push(user);
    await fs.promises.writeFile(usersFilePath, JSON.stringify(users, null, 2));
}
