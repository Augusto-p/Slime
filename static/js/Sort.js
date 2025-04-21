function FilesSort(A, B) {
    const A_Hiden = A.Name[0] === ".";
    const B_Hiden = B.Name[0] === ".";
    if (A_Hiden !== B_Hiden) return A_Hiden? -1 : 1;
    const A_Directory = (A.Type === "Directory");
    const B_Directory = (B.Type === "Directory");
    if (A_Directory !== B_Directory) return A_Directory? -1 : 1;

    return A.Name.localeCompare(B.Name, undefined, {sensitivity: "base"})
    
}