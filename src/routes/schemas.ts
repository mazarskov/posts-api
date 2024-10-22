import { Static, Type } from "@sinclair/typebox";

export const PostBodySchema = Type.Object({
  text: Type.String(),
  hashtags: Type.Optional(Type.Array(Type.String())),
  user_id: Type.Integer(),
});

export const searchQuerySchema = Type.Object({
  text: Type.Optional(Type.String()),
  tag: Type.Optional(Type.String()),
});

export const searchParamsSchema = Type.Object({
  id: Type.Number(),
})

export type PostBodyType = Static<typeof PostBodySchema>;
export type searchQueryType = Static<typeof searchQuerySchema>;
export type searchParamsType = Static<typeof searchParamsSchema>;
