import { useState } from "preact/hooks";
import { Msg, TranslationSetup } from "../components/Msg.tsx";
import type { Language } from "../i18n.ts";
import getFixedT from "../i18n.ts";

export interface PostControlsProps {
  language: Language;
  active?: "reply" | "sharedPeople";
  class?: string;
  replies: number;
  replyUrl?: string;
  shares: number;
  shared: boolean;
  shareUrl?: string;
  unshareUrl?: string;
  sharedPeopleUrl?: string;
  deleteUrl?: string;
  deleteMethod?: "DELETE" | "POST" | "delete" | "post";
}

export function PostControls(props: PostControlsProps) {
  const t = getFixedT(props.language);
  const [shares, setShares] = useState(props.shares);
  const [shared, setShared] = useState(props.shared);
  const [shareSubmitting, setShareSubmitting] = useState(false);
  const [shareFocused, setShareFocused] = useState(false);
  const [deleted, setDeleted] = useState<null | "deleting" | "deleted">(null);

  function onShareSubmit(this: HTMLFormElement, event: SubmitEvent) {
    event.preventDefault();
    if (props.shareUrl == null) return;
    if (event.currentTarget instanceof HTMLFormElement) {
      setShareSubmitting(true);
      const form = event.currentTarget;
      fetch(form.action, { method: form.method })
        .then((response) => {
          if (response.status >= 200 && response.status < 400) {
            setShared(!shared);
            setShareSubmitting(false);
            setShares(shares + (shared ? -1 : 1));
          }
        });
    }
  }

  function onShareFocus() {
    setShareFocused(true);
  }

  function onShareFocusOut() {
    setShareFocused(false);
  }

  function onDelete(this: HTMLButtonElement, _event: MouseEvent) {
    if (props.deleteUrl == null || !confirm(t("note.deleteConfirm"))) return;
    setDeleted("deleting");
    fetch(props.deleteUrl, { method: props.deleteMethod ?? "delete" })
      .then((response) => {
        if (response.status >= 200 && response.status < 400) {
          setDeleted("deleted");
        }
      });
  }

  return (
    <TranslationSetup language={props.language}>
      <div class={`${props.class ?? ""} flex gap-3`}>
        <a
          class={`h-5 flex opacity-50 ${
            deleted != null || props.replyUrl == null ? "" : "hover:opacity-100"
          }`}
          href={props.replyUrl}
          title={t("note.replies")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`size-5 ${props.active === "reply" ? "stroke-2" : ""}`}
            aria-label={t("note.replies")}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
            />
          </svg>
          <span
            class={`ml-1 my-auto text-xs ${
              props.active === "reply" ? "font-bold" : ""
            }`}
          >
            {props.replies.toLocaleString(props.language)}
          </span>
        </a>
        <form
          method="post"
          action={shared ? props.unshareUrl : props.shareUrl}
          onSubmit={onShareSubmit}
        >
          <button
            type="submit"
            class={`h-5 flex opacity-50 ${
              deleted != null || props.shareUrl == null
                ? "cursor-default"
                : "hover:opacity-100"
            }`}
            onMouseOver={onShareFocus}
            onFocus={onShareFocus}
            onMouseOut={onShareFocusOut}
            onBlur={onShareFocusOut}
            title={t("note.shares")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`size-5 ${shared ? "stroke-2" : ""}`}
              aria-label={t("note.shares")}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
              />
            </svg>
            <span
              class={`ml-1 my-auto text-xs ${shared ? "font-bold" : ""}`}
            >
              {(shared ? Math.max(shares, 1) : shares).toLocaleString(
                props.language,
              )}
              {(shared || shareSubmitting) && (
                <>
                  {" "}&mdash;{" "}
                  <Msg
                    $key={shareSubmitting
                      ? (shared ? "note.unsharing" : "note.sharing")
                      : shareFocused
                      ? "note.unshare"
                      : "note.shared"}
                  />
                </>
              )}
            </span>
          </button>
        </form>
        {props.sharedPeopleUrl != null && (
          <a
            class={`h-5 flex opacity-50 ${
              deleted != null ? "" : "hover:opacity-100"
            }`}
            href={props.sharedPeopleUrl}
            title={t("note.sharedPeople")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`size-5 ${
                props.active === "sharedPeople" ? "stroke-2" : ""
              }`}
              aria-label={t("note.sharedPeople")}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
              />
            </svg>
          </a>
        )}
        {props.deleteUrl != null &&
          (
            <button
              type="button"
              class={`h-5 flex opacity-50 ${
                deleted != null || props.deleteUrl == null
                  ? "cursor-default"
                  : "hover:opacity-100"
              }`}
              title={t("note.delete")}
              onClick={onDelete}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`size-5 ${deleted === "deleted" ? "stroke-2" : ""}`}
                aria-label={t("note.delete")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
              {deleted != null &&
                (
                  <span
                    class={`ml-1 my-auto text-xs ${
                      deleted === "deleted" ? "font-bold" : ""
                    }`}
                  >
                    {" — "}
                    <Msg
                      $key={deleted === "deleted"
                        ? "note.deleted"
                        : "note.deleting"}
                    />
                  </span>
                )}
            </button>
          )}
      </div>
    </TranslationSetup>
  );
}
