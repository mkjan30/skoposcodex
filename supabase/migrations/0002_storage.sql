-- Private bucket for onboarding uploads (docs/05-Backend-Schema.md §6).
-- Uploads use server-issued signed upload URLs; reads use admin-issued signed URLs,
-- so the only object policy needed is admin read.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'onboarding-files',
  'onboarding-files',
  false,
  26214400, -- 25 MB
  array[
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/svg+xml',
    'image/webp',
    'application/zip',
    'application/postscript',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
);

create policy onboarding_files_admin_read on storage.objects
  for select using (bucket_id = 'onboarding-files' and public.is_admin());
