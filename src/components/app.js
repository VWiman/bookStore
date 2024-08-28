import React, { useEffect, useRef, useState } from "react";

export default function App() {
	// Global States
	const [modal, setModal] = useState(false);
	const [activeId, setActiveId] = useState(null);
	const [dataList, setDatalist] = useState([]);
	const [fetched, setFetched] = useState(false);

	// Local States
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [year, setYear] = useState("");
	const [pages, setPages] = useState("");
	const [description, setDescription] = useState("");
	const [isbn, setIsbn] = useState("");
	const [edition, setEdition] = useState("");
	const [image, setImage] = useState("");

	// Ref to persist idCount across renders
	const idCountRef = useRef(1);

	async function fetchBooks() {
		const readOnly = process.env.READONLY;
		const url = "https://api.jsonbin.io/v3/b/66cdd19cad19ca34f89bc395";
		const settings = {
			method: "GET",
			headers: {
				"X-Access-Key": readOnly,
				"X-Bin-Meta": "false",
			},
		};

		const promise = await fetch(url, settings);
		const response = await promise.json();
		response.map((book) => {
			book.id = idCountRef.current++;
		});
		setFetched(true);
		setDatalist((prevDataList) => [...prevDataList, ...response]);
	}

	function bookManager() {
		const Create = async (event) => {
			event.preventDefault();
			const newBook = {
				id: idCountRef.current++,
				image: image,
				title: title,
				author: author,
				pages: pages,
				year: year,
				description: description,
				isbn: isbn,
				edition: edition,
			};

			const updatedList = JSON.stringify([...dataList, {...newBook}]);

			const updateOnly = process.env.UPDATEONLY;
			const url = "https://api.jsonbin.io/v3/b/66cdd19cad19ca34f89bc395";
			const settings = {
				method: "PUT",
				headers: {
					"X-Access-Key": updateOnly,
					"X-Bin-Meta": "false",
					"Content-Type": "application/json",
				},
				body: updatedList,
			};
			try {
				const promise = await fetch(url, settings);
				if (!promise.ok) throw new Error("Failed to update the books");
				console.log("Added book.");
				fetchBooks()
			} catch (error) {
				console.error("Error:", error);
			}
		};

		const addBook = (newBook) => {
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

	const { Create, Read, Update, Delete } = bookManager();

	useEffect(() => {
		fetchBooks();
	}, []);

	return (
		<>
			<header className="header-container">
				<h1>The Book Corner</h1>
				<button
					className="admin-button"
					onClick={() => {
						setModal(!modal);
					}}>
					Admin Panel
				</button>
			</header>
			<main>
				<div className={modal ? "hidden" : "main-container"}>
					<div className="book-list-container">
						<h2 className="book-list-header">Book list</h2>
						<small className="book-list-header-sub">in the corner this week</small>
						<table className="table">
							<thead className="table-head">
								<tr className="table-head-row">
									<th className="cell">Title</th>
									<th className="cell">Author</th>
									<th className="cell">Year</th>
								</tr>
							</thead>
							<tbody className="table-body">
								{fetched
									? dataList.map((book) => (
											<tr className="table-row" key={book.id} onClick={() => setActiveId(book.id)}>
												<td className="cell">{book.title}</td>
												<td className="cell">{book.author}</td>
												<td className="cell">{book.year}</td>
											</tr>
									  ))
									: Array.from({ length: 20 }).map((_, index) => (
											<tr className="table-row" key={`loading-${index}`}>
												<td className="cell">Loading</td>
												<td className="cell">---</td>
												<td className="cell">---</td>
											</tr>
									  ))}
							</tbody>
						</table>
					</div>
					<div className="book-info-container">
						<div className="image-stat-container">
							<dl>
								<img
									className="book-img"
									alt={activeId ? Read()?.title : "Select"}
									src={activeId ? "/images/" + Read()?.image + ".png" : "/images/select.png"}
								/>
							</dl>
							<div className="stat-container">
								<small className="book-info-header-sub">the facts</small>
								<dl>
									<dt>author</dt>
									<dd>{activeId ? Read()?.author : ""}</dd>
								</dl>
								<dl>
									<dt>year</dt>
									<dd>{activeId ? Read()?.year : "---"}</dd>
								</dl>
								<dl>
									<dt>pages</dt>
									<dd>{activeId ? Read()?.pages : "---"}</dd>
								</dl>
								<dl>
									<dt>edition</dt>
									<dd>{activeId ? Read()?.edition : "---"}</dd>
								</dl>
								<dl>
									<dt>isbn</dt>
									<dd>{activeId ? Read()?.isbn : "---"}</dd>
								</dl>
							</div>
						</div>
						<div>
							<h3 className="book-info-title">{activeId ? Read()?.title : ""}</h3>
							<p className="book-info-description">{activeId ? Read()?.description : ""}</p>
						</div>
					</div>
				</div>
				<div className="form-container">
					<form className={modal ? "form" : "hidden"} id="form">
						<div>
							<label htmlFor="title">title:</label>
							<input
								type="text"
								id="title"
								name="title"
								value={title}
								onChange={(event) => {
									setTitle(event.target.value);
								}}></input>
							<label htmlFor="author">author:</label>
							<input
								type="text"
								id="author"
								name="author"
								value={author}
								onChange={(event) => {
									setAuthor(event.target.value);
								}}></input>
						</div>
						<div>
							<label htmlFor="year">year:</label>
							<input
								type="number"
								id="year"
								name="year"
								value={year}
								onChange={(event) => {
									setYear(event.target.value);
								}}></input>
							<label htmlFor="pages">pages:</label>
							<input
								type="number"
								id="pages"
								name="pages"
								value={pages}
								onChange={(event) => {
									setPages(event.target.value);
								}}></input>
						</div>
						<div>
							<label htmlFor="description">description:</label>
							<textarea
								id="description"
								name="description"
								rows="4"
								cols="50"
								value={description}
								onChange={(event) => {
									setDescription(event.target.value);
								}}></textarea>
						</div>
						<div>
							<label htmlFor="isbn">isbn:</label>
							<input
								id="isbn"
								name="isbn"
								value={isbn}
								onChange={(event) => {
									setIsbn(event.target.value);
								}}></input>
							<label htmlFor="edition">edition:</label>
							<input
								id="edition"
								name="edition"
								value={edition}
								onChange={(event) => {
									setEdition(event.target.value);
								}}></input>
						</div>
						<div>
							<label htmlFor="image">image:</label>
							<input
								id="image"
								name="image"
								value={image}
								onChange={(event) => {
									setImage(event.target.value);
								}}></input>
						</div>
						<button
							onClick={(event) => {
								Create(event);
							}}>
							Submit
						</button>
					</form>
				</div>
			</main>
		</>
	);
}