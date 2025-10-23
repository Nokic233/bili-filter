export const formStorage = storage.defineItem<{
    videoTitle: string[];
    authorName: string[];
    filterMode: 'blur' | 'hide';
}>('local:form', {
    fallback: {
        videoTitle: [],
        authorName: [],
        filterMode: 'blur',
    },
});
