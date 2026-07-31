'use client';

import { useEffect, useRef, useState } from 'react';
import './EditRequest.css';

// Select text in the poem → floating "რედაქტირების მოთხოვნა" action →
// modal (email + corrected text + optional note) → POST /api/edit-request
// → Telegram (see src/app/api/edit-request/route.ts).

type EditRequestProps = {
  poemId: number;
  poemTitle: string;
};

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function EditRequest({ poemId, poemTitle }: EditRequestProps) {
  const [selectedText, setSelectedText] = useState('');
  const [actionPos, setActionPos] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    function place() {
      const selection = document.getSelection();
      if (!selection || selection.isCollapsed) {
        setActionPos(null);
        return;
      }
      const text = selection.toString().trim();
      if (!text) {
        setActionPos(null);
        return;
      }
      const range = selection.getRangeAt(0);
      const node = range.commonAncestorContainer;
      const element = node instanceof Element ? node : node.parentElement;
      if (!element?.closest('.PoemView')) {
        setActionPos(null);
        return;
      }
      const rect = range.getBoundingClientRect();
      setSelectedText(text);
      setActionPos({
        top: Math.max(rect.top - 8, 52),
        left: Math.min(
          Math.max(rect.left + rect.width / 2, 90),
          window.innerWidth - 90,
        ),
      });
    }
    document.addEventListener('selectionchange', place);
    window.addEventListener('scroll', place, { passive: true });
    window.addEventListener('resize', place);
    return () => {
      document.removeEventListener('selectionchange', place);
      window.removeEventListener('scroll', place);
      window.removeEventListener('resize', place);
    };
  }, []);

  useEffect(() => {
    if (open) dialogRef.current?.showModal();
  }, [open]);

  function openModal() {
    setStatus('idle');
    setOpen(true);
    setActionPos(null);
  }

  function closeModal() {
    dialogRef.current?.close();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus('sending');
    try {
      const response = await fetch('/api/edit-request/', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: form.get('email'),
          corrected: form.get('corrected'),
          note: form.get('note'),
          website: form.get('website'),
          original: selectedText,
          poemId,
          poemTitle,
        }),
      });
      setStatus(response.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <>
      {actionPos && !open && (
        <button
          type="button"
          className="EditRequest__action"
          style={{ top: actionPos.top, left: actionPos.left }}
          onMouseDown={(event) => event.preventDefault()}
          onClick={openModal}
        >
          რედაქტირების მოთხოვნა
        </button>
      )}
      {open && (
        <dialog
          ref={dialogRef}
          className="EditRequest__dialog"
          aria-label="რედაქტირების მოთხოვნა"
          onClose={() => setOpen(false)}
        >
          {status === 'sent' ? (
            <div className="EditRequest__done">
              <p className="EditRequest__doneTitle">მადლობა!</p>
              <p className="EditRequest__doneText">
                მოთხოვნა გაიგზავნა და განხილული იქნება.
              </p>
              <div className="EditRequest__buttons">
                <button
                  type="button"
                  className="EditRequest__submit"
                  onClick={closeModal}
                >
                  დახურვა
                </button>
              </div>
            </div>
          ) : (
            <form className="EditRequest__form" onSubmit={handleSubmit}>
              <p className="EditRequest__title">რედაქტირების მოთხოვნა</p>
              <blockquote className="EditRequest__quote">
                {selectedText}
              </blockquote>
              <label className="EditRequest__label" htmlFor="er-email">
                ელფოსტა
              </label>
              <input
                className="EditRequest__input"
                id="er-email"
                name="email"
                type="email"
                required
                maxLength={200}
                autoComplete="email"
              />
              <label className="EditRequest__label" htmlFor="er-corrected">
                შესწორებული ვერსია
              </label>
              <textarea
                className="EditRequest__textarea"
                id="er-corrected"
                name="corrected"
                required
                maxLength={1500}
                rows={3}
                defaultValue={selectedText}
              />
              <label className="EditRequest__label" htmlFor="er-note">
                განმარტება (არასავალდებულო)
              </label>
              <textarea
                className="EditRequest__textarea"
                id="er-note"
                name="note"
                maxLength={1000}
                rows={2}
              />
              <input
                className="EditRequest__website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              {status === 'error' && (
                <p className="EditRequest__error" role="alert">
                  ვერ გაიგზავნა - სცადე თავიდან.
                </p>
              )}
              <div className="EditRequest__buttons">
                <button
                  type="button"
                  className="EditRequest__cancel"
                  onClick={closeModal}
                >
                  გაუქმება
                </button>
                <button
                  type="submit"
                  className="EditRequest__submit"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'იგზავნება…' : 'გაგზავნა'}
                </button>
              </div>
            </form>
          )}
        </dialog>
      )}
    </>
  );
}
