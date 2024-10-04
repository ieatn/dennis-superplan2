import { client } from './config.jsx';

export default async function GetBlogPosts() {
  try {
    const response = await client.getEntries({
      content_type: 'pageBlogPost',
    });
    // console.log('Individual item fields:', response.items[1].fields);
    const processedPosts = response.items.map(item => {
      // console.log('Individual item fields:', item.fields);
      return {
        fields: {
          title: item.fields.title || '',
          content: item.fields.content ? item.fields.content.content[0].content[0].value : '',
          createdAt: item.sys.createdAt || '',
          image: item.fields.featuredImage ? item.fields.featuredImage.fields.file.url : '',
          author: item.fields.author && item.fields.author.fields ? item.fields.author.fields.internalName || '' : '',
          subtitle: item.fields.subtitle || '',
          publishedDate: item.fields.publishedDate || '',
          shortDescription: item.fields.shortDescription || ''
        }
      };
    });

    return processedPosts;

  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}