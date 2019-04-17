export const mapFilesToFormData = (items: FileList) => {
    const data = new FormData();
    const files: Array<File> = [].map.call(items, x => x);
    files.forEach(x => data.append(x.name, x));
    return data;
};