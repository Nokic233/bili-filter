export const formStorage = storage.defineItem<{
    videoTitle: string[];
    authorName: string[];
    filterMode: 'blur' | 'hide' | 'tip';
}>('local:form', {
    fallback: {
        videoTitle: [],
        authorName: [],
        filterMode: 'blur',
    },
});
