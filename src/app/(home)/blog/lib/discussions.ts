import {
  CreateDiscussionPayload,
  Discussion,
  SearchResultItemConnection,
  UpdateDiscussionPayload,
} from '@octokit/graphql-schema';
import {App} from 'octokit';

import {Post} from '@/app/(home)/blog/lib/posts';

const getPrivateKey = () => {
  const key = process.env.PRIVATE_KEY_GITHUB;
  if (!key) throw new Error('Missing PRIVATE_KEY_GITHUB in env');
  return key;
};

const getAppId = () => {
  const appId = process.env.APP_ID_GITHUB;
  if (!appId) throw new Error('Missing APP_ID_GITHUB in env');
  return appId;
};

const getInstallationId = () => {
  const installId = process.env.INSTALLATION_ID_GITHUB;
  if (!installId) throw new Error('Missing INSTALLATION_ID_GITHUB in env');
  return parseInt(installId);
};

const app = new App({
  appId: getAppId(),
  privateKey: getPrivateKey(),
});

const getPostHref = (slug: string): string => `https://loga.nz/blog/${slug}`;

const getDiscussionBody = (post: Post): string =>
  `${getPostHref(post.data.slug)}

_${post.data.description}_`;

const findDiscussionByPost = async (post: Post): Promise<Discussion | null> => {
  const octokit = await app.getInstallationOctokit(getInstallationId());
  const searchQuery = `repo:loganzartman/loga.nz in:body ${getPostHref(
    post.data.slug,
  )}`;
  const result = await octokit.graphql<{search: SearchResultItemConnection}>(
    `
      query FindDiscussion($searchQuery: String!) {
        search(type: DISCUSSION, query: $searchQuery, first: 1) {
          nodes {
            ... on Discussion {
              __typename
              id
              title
              url
            }
          }
        }
      }
    `,
    {searchQuery},
  );

  const firstNode = result.search.nodes?.[0];
  if (!firstNode) return null;
  if (firstNode.__typename !== 'Discussion')
    throw new Error(`Got result with typename: ${firstNode.__typename}`);
  return firstNode;
};

const createDiscussionByPost = async (post: Post) => {
  const octokit = await app.getInstallationOctokit(getInstallationId());
  const result = await octokit.graphql<{
    createDiscussion: CreateDiscussionPayload;
  }>(
    `
      mutation CreateDiscussion($title: String!, $body: String!) {
        createDiscussion(
          input: {
            repositoryId: "R_kgDOKhr5aQ"
            categoryId: "DIC_kwDOKhr5ac4CanRa"
            title: $title
            body: $body
          }
        ) {
          discussion {
            id
            url
          }
        }
      }
    `,
    {
      title: post.data.title,
      body: getDiscussionBody(post),
    },
  );

  const discussion = result.createDiscussion.discussion;
  if (!discussion) throw new Error('Could not create discussion');
  return discussion;
};

const updateDiscussionByPost = async (discussion: {id: string}, post: Post) => {
  const octokit = await app.getInstallationOctokit(getInstallationId());
  const result = await octokit.graphql<{
    updateDiscussion: UpdateDiscussionPayload;
  }>(
    `
      mutation UpdateDiscussion($discussionId: ID!, $title: String!, $body: String!) {
        updateDiscussion(
          input: {
            discussionId: $discussionId
            title: $title
            body: $body
          }
        ) {
          discussion {
            id
            url
          }
        }
      }
    `,
    {
      discussionId: discussion.id,
      title: post.data.title,
      body: getDiscussionBody(post),
    },
  );

  const updatedDiscussion = result.updateDiscussion.discussion;
  if (!updatedDiscussion) throw new Error('Could not create discussion');
  return updatedDiscussion;
};

export const createDiscussionHref = async (post: Post) => {
  let discussion = await findDiscussionByPost(post);
  if (!discussion) {
    discussion = await createDiscussionByPost(post);
  }
  const updated = await updateDiscussionByPost(discussion, post);
  return updated.url;
};
