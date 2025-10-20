export const formStorage = storage.defineItem<{
    videoTitle: string[];
    authorName: string[];
}>('local:form', {
    fallback: {
        videoTitle: [],
        authorName: [],
    },
});
