export default function bookManager(activeId, dataList, idCount) {

		const Create = (newBook) => {
			newBook.id = idCount++;
			setDatalist((prevDataList) => [...prevDataList, newBook]);
		};

		const Read = () => {
			const item = dataList.find((book) => book.id === activeId);
			return item;
		};

		const Update = (updatedBook) => {
			setDatalist((prevDataList) =>
				prevDataList.map((oldBook) => (oldBook.id === activeId ? { ...oldBook, ...updatedBook } : oldBook))
			);
		};

		const Delete = () => {
			setDatalist((prevDataList) => prevDataList.filter((oldBook) => oldBook.id !== activeId));
		};
		return { Create, Read, Update, Delete };
	}