-- Create a new storage bucket called 'images'
insert into storage.buckets (id, name, public)
values ('images', 'images', true);

-- Policy to allow public viewing of images
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'images' );

-- Policy to allow authenticated users to upload images
create policy "Authenticated Upload"
on storage.objects for insert
with check ( bucket_id = 'images' and auth.role() = 'authenticated' );

-- Policy to allow users to update their own images (simplified)
create policy "Authenticated Update"
on storage.objects for update
using ( bucket_id = 'images' and auth.role() = 'authenticated' );
