export const geExtremeItemPerPage = (
  page: number,
  itemsPerPage: number,
  listLengt: number,
) => {
  const firstItemPerPage = (page - 1) * itemsPerPage;
  const lastItemPerPage =
    page * itemsPerPage > listLengt ? listLengt : page * itemsPerPage;

  return [firstItemPerPage, lastItemPerPage];
};
