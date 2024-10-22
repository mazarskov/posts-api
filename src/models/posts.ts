import { FastifyInstance } from "fastify";
import { searchQueryType, searchParamsType } from "../routes/schemas";
import { User } from "./users";

const TABLE_NAME = "posts";

export interface Post {
  id: number;
  text: string;
  likes: number;
  hashtags?: string;
  user_id: number;
}
export interface PostDTO {
  id: number;
  text: string;
  likes: number;
  hashtags?: string;
  user: User;
}

interface PostQueryResult {
  id: number;
  text: string;
  likes: number;
  hashtags?: string;
  user_id: number;
  username: string;
  bio: string;
}

const formatPostDTO = (queryResult: PostQueryResult): PostDTO => {
  return {
    id: queryResult.id,
    text: queryResult.text,
    likes: queryResult.likes,
    hashtags: queryResult.hashtags,
    user: {
      id: queryResult.user_id,
      username: queryResult.username,
      bio: queryResult.bio,
    },
  };
};

export async function createPost(
  fastify: FastifyInstance,
  post: {
    text: string;
    hashtags?: string[];
    user_id: number;
  }
): Promise<Post> {
  return await fastify.tars.from(TABLE_NAME).insert({
    text: post.text,
    likes: 0,
    hashtags: post.hashtags,
    user_id: post.user_id,
  });
}

export async function getPosts(
  fastify: FastifyInstance,
  query: searchQueryType
): Promise<any> {
  const queryResult = fastify.tars
    .from(TABLE_NAME)
    .innerJoin("users", "users.id", "posts.user_id")
    .select();

  if (query.text) queryResult.whereLike("posts.text", `%${query.text}%`);
  if (query.tag) queryResult.whereLike("posts.hashtags", `%${query.tag}%`);

  return (await queryResult.then()).map(formatPostDTO);
}

export async function getPost(
  fastify: FastifyInstance,
  params: searchParamsType
): Promise<any> {
  const post = fastify.tars
    .from(TABLE_NAME)
    .innerJoin("users", "users.id", "posts.user_id")
    .where({ "posts.id": params.id })
    .select();

  if (!post) return null;
  return (await post.then()).map(formatPostDTO);
}

export async function deletePost(
  fastify: FastifyInstance,
  id: number
): Promise<void> {
  await fastify.tars.from(TABLE_NAME).where({ id }).del();
}
