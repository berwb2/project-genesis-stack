
-- Create a new public storage bucket for document images
insert into storage.buckets
  (id, name, public, file_size_limit, allowed_mime_types)
values
  ('document_images', 'document_images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

-- RLS Policy: Allow public read access to all images in the bucket
create policy "Public view access for document images"
on storage.objects for select
to public
using ( bucket_id = 'document_images' );

-- RLS Policy: Allow authenticated users to upload images
create policy "Authenticated users can upload images"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'document_images' and auth.uid() = owner );

-- RLS Policy: Allow authenticated users to update their own images
create policy "Authenticated users can update their own images"
on storage.objects for update
to authenticated
using ( auth.uid() = owner )
with check ( bucket_id = 'document_images' );

-- RLS Policy: Allow authenticated users to delete their own images
create policy "Authenticated users can delete their own images"
on storage.objects for delete
to authenticated
using ( auth.uid() = owner );
