import { CreatePostData, Post } from "./types";

const API_URL = 'https://jsonplaceholder.typicode.com';

export async function getPosts(): Promise<Post[]> {
  const response = await fetch(`${API_URL}/posts`);
  if (!response.ok) throw new Error('Failed to fetch posts');
  return response.json();
}

export async function createPost(data: CreatePostData): Promise<Post> {
  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create post');
  return response.json();
}

export async function updatePost(id: number, data: Partial<CreatePostData>): Promise<Post> {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update post');
  return response.json();
}

export async function deletePost(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete post');
}