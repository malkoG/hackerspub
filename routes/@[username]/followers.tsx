import { and, desc, eq, isNotNull, lt } from "drizzle-orm";
import { page } from "fresh";
import { ActorList } from "../../components/ActorList.tsx";
import { Msg } from "../../components/Msg.tsx";
import { PageTitle } from "../../components/PageTitle.tsx";
import { db } from "../../db.ts";
import { extractMentionsFromHtml } from "../../models/markup.ts";
import {
  type Account,
  accountTable,
  type Actor,
  followingTable,
} from "../../models/schema.ts";
import { define } from "../../utils.ts";

const WINDOW = 23;

export const handler = define.handlers({
  async GET(ctx) {
    const { username } = ctx.params;
    if (username.includes("@")) return ctx.next();
    const account = await db.query.accountTable.findFirst({
      with: { actor: true },
      where: eq(accountTable.username, username),
    });
    if (account == null) return ctx.redirect(`/@${username}`);
    const until = ctx.url.searchParams.get("until");
    const followers = await db.query.followingTable.findMany({
      with: {
        follower: {
          with: { account: true },
        },
      },
      where: and(
        eq(followingTable.followeeId, account.actor.id),
        isNotNull(followingTable.accepted),
        until == null || !until.match(/^\d+(\.\d+)?$/)
          ? undefined
          : lt(followingTable.accepted, new Date(parseInt(until))),
      ),
      orderBy: desc(followingTable.accepted),
      limit: WINDOW + 1,
    });
    let nextUrl: string | undefined;
    if (followers.length > WINDOW) {
      nextUrl = `?until=${followers[WINDOW - 1].accepted!.getTime()}`;
    }
    const followersMentions = await extractMentionsFromHtml(
      db,
      ctx.state.fedCtx,
      followers.slice(0, WINDOW).map((f) => f.follower.bioHtml).join("\n"),
      {
        documentLoader: await ctx.state.fedCtx.getDocumentLoader(account),
      },
    );
    ctx.state.title = ctx.state.t("profile.followerList.title", {
      name: account.name,
    });
    return page<FollowerListProps>({
      account,
      followers: followers.map((f) => f.follower).slice(0, WINDOW),
      followersMentions,
      nextUrl,
    });
  },
});

interface FollowerListProps {
  account: Account;
  followers: (Actor & { account?: Account | null })[];
  followersMentions: { actor: Actor }[];
  nextUrl?: string;
}

export default define.page<typeof handler, FollowerListProps>(
  function FollowerList({ data }) {
    return (
      <>
        <PageTitle>
          <Msg
            $key="profile.followerList.title"
            name={
              <a href={`/@${data.account.username}`} rel="top">
                {data.account.name}
              </a>
            }
          />
        </PageTitle>
        <ActorList
          actors={data.followers}
          actorMentions={data.followersMentions}
          nextUrl={data.nextUrl}
        />
      </>
    );
  },
);
