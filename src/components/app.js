import React, { useEffect, useState } from "react";

export default function App() {
	let idCount = 1;
	const [activeId, setActiveId] = useState(null);
	const [dataList, setDatalist] = useState([]);

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
		console.log(settings);
		const promise = await fetch(url, settings);
		const response = await promise.json();
		response.map((book) => {
			console.log(book);
			book.id = idCount++;
		});
		setDatalist((prevDataList) => [...prevDataList, ...response]);
	}

	function bookManager() {
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

	const { Create, Read, Update, Delete } = bookManager();

	useEffect(() => {
		fetchBooks();
	}, []);

	return (
		<>
			<header className="header-container">
				<img src="/book.png" width={205} height={202} className="corner-img"></img>
				<h1>The Book Corner</h1>
			</header>
			<main className="main-container">
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
							{dataList.map((book) => (
								<tr className="table-row" key={book.id} onClick={() => setActiveId(book.id)}>
									<td className="cell">{book.title}</td>
									<td className="cell">{book.author}</td>
									<td className="cell">{book.year}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className="book-info-container">
					<div className="image-stat-container">
						<dl>
							<img className="book-img" src={activeId ? Read().image + ".png" : ""}></img>
						</dl>
						<div className="stat-container">
							<small className="book-info-header-sub">the facts</small>
							<dl>
								<dt>author</dt>
								<dd>{activeId ? Read().author : "---"}</dd>
							</dl>
							<dl>
								<dt>year</dt>
								<dd>{activeId ? Read().year : "---"}</dd>
							</dl>
							<dl>
								<dt>pages</dt>
								<dd>{activeId ? Read().pages : "---"}</dd>
							</dl>
							<dl>
								<dt>edition</dt>
								<dd>{activeId ? Read().edition : "---"}</dd>
							</dl>
							<dl>
								<dt>isbn</dt>
								<dd>{activeId ? Read().isbn : "---"}</dd>
							</dl>
						</div>
					</div>
					<div>
						<h3 className="book-info-title">{activeId ? Read().title : ""}</h3>

						<p className="book-info-description">{activeId ? Read().description : ""}</p>
					</div>
				</div>
			</main>
		</>
	);
}
