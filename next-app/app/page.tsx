interface Task {
	title: string,
	description?: string,
	id: number,
	createdAt: Date,
	due?: Date,
	labels?: string[]
}


function tomorrow() {
	const tomorrow = new Date()
	tomorrow.setTime(tomorrow.getTime() + 24 * 60 * 60 * 1000);
	return tomorrow

}

const defaultTasks: Task[] = [
	{ title: "Take out trash", id: 0, createdAt: new Date() },
	{ title: "Feed dogs", id: 1, description: "Arnold is allergic to chicken", due: new Date(), createdAt: new Date() },
	{ title: "Make dinner", id: 2, createdAt: new Date(), description: "Fried rice", due: tomorrow() }
]

interface Account {
	tasks: Task[]
}

function sameDay(a: Date, b: Date): boolean {
	return a.getFullYear() == b.getFullYear() && a.getMonth() == b.getMonth() && a.getDate() == b.getDate()
}

function todayTasks(account: Account): Task[] {
	const today = new Date()
	return account.tasks.filter((task) => task.due && sameDay(today, task.due))
}

function TaskWidget({ task }: { task: Task }) {
	return <div className="bg-white rounded-xl max-w-sm m-4 p-3">
		<h2 className="text-lg">{task.title}</h2>
		<p className="text-slate-500">{task.description}</p>
		<p>Created at {task.createdAt.toDateString()}</p>
		{task.due ? <p>Due at {task.due.toDateString()}</p> : <></>}
	</div>
}

function TaskList({ tasks }: { tasks: Task[] }) {
	return <div>{tasks.map((task) => <TaskWidget key={task.id} task={task}></TaskWidget>)}</div>
}

export default function Home() {
	return (
		<main>
			<TaskList tasks={defaultTasks}></TaskList>
		</main>
	)
}
