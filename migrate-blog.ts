import { collection, doc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';

import TurndownService from 'turndown';
// import { environment } from '../../../environments/environment';
import { initializeApp } from 'firebase/app';

export const environment = {
  firebase: {
    apiKey: 'AIzaSyAE40sPvWZmjlP22TMADTA3PWfuQyGh-SE',
    authDomain: 'portfolio-blog-79bf6.firebaseapp.com',
    projectId: 'portfolio-blog-79bf6',
    storageBucket: 'portfolio-blog-79bf6.firebasestorage.app',
    messagingSenderId: '169991423661',
    appId: '1:169991423661:web:c3e1d0c3a961b6c06ea824',
    measurementId: 'G-HNPKTKWX77',
  },
};

const firebaseConfig = environment.firebase;
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const turndownService = new TurndownService({
  codeBlockStyle: 'fenced',
  fence: '```',
  headingStyle: 'atx',
  hr: '---',
  bulletListMarker: '-',
});

turndownService.addRule('codeBlocks', {
  filter: ['pre'],
  replacement: (content, node) => {
    const codeNode = node.firstChild as HTMLElement;
    const language =
      codeNode && typeof codeNode.className === 'string'
        ? codeNode.className.replace('language-', '')
        : 'typescript';
    return `\n\`\`\`${language}\n${content.trim()}\n\`\`\`\n`;
  },
});

async function migrateBlog() {
  const blogSnapshot = await getDocs(collection(db, 'blogs'));

  for (const blog of blogSnapshot.docs) {
    const data = blog.data();
    if (data['content'] && data['content'].includes('<')) {
      const markdown = turndownService.turndown(data['content']);

      await updateDoc(doc(db, 'blogs', blog.id), {
        content: markdown,
        format: 'markdown',
      });

      console.log(`✅ Migrated blog ID: ${blog.id}`);
    } else {
      console.log(`⏭ Skipped (already markdown): ${data['title']}`);
    }
  }
}

migrateBlog()
  .then(() => console.log('🎉 Migration completed'))
  .catch(console.error);
