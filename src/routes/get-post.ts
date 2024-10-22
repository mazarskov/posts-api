import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteOptions,
} from "fastify";

import * as postsModel from "../models/posts";
import { searchParamsType } from "./schemas";

export default function getIndex(fastify: FastifyInstance): RouteOptions {
  return {
    method: "GET",
    url: "/posts/:id",
    handler: async function (request: FastifyRequest, reply: FastifyReply) {
      const { id } = request.params as { id: number };
      const params = request.params as searchParamsType;
      const post = await postsModel.getPost(fastify, params);
      reply.send(post);
    },
  };
}
