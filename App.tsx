import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { getPosts, createPost, updatePost, deletePost } from './api';
import { PostCard } from './components/PostCard';
import { PostForm } from './components/PostForm';
import type { Post, CreatePostData } from './types';

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreatePost(data: CreatePostData) {
    try {
      const newPost = await createPost(data);
      setPosts([newPost, ...posts]);
      setShowForm(false);
    } catch (err) {
      setError('Failed to create post');
    }
  }

  async function handleUpdatePost(data: CreatePostData) {
    if (!editingPost) return;
    try {
      const updatedPost = await updatePost(editingPost.id, data);
      setPosts(posts.map(post => 
        post.id === editingPost.id ? updatedPost : post
      ));
      setEditingPost(null);
    } catch (err) {
      setError('Failed to update post');
    }
  }

  async function handleDeletePost(id: number) {
    try {
      await deletePost(id);
      setPosts(posts.filter(post => post.id !== id));
    } catch (err) {
      setError('Failed to delete post');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-xl text-yellow-800">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-yellow-800">Posts</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
          >
            <Plus size={20} />
            Create Post
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onEdit={setEditingPost}
              onDelete={handleDeletePost}
            />
          ))}
        </div>

        {(showForm || editingPost) && (
          <PostForm
            post={editingPost || undefined}
            onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
            onClose={() => {
              setShowForm(false);
              setEditingPost(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;