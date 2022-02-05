const EmptyTaskSVG = () => {
    return (
        <div id="empty-task-svg" className="grid flex flex-column justify-content-center align-items-center">
            <svg className="opacity-40" width="136" height="84" viewBox="0 0 136 84" fill="none" xmlns="http://www.w3.org/2000/svg" >
                <rect x="29" width="77" height="8" rx="4" fill="#999"></rect>
                <rect x="29" y="13" width="57" height="8" rx="4" fill="#999"></rect>
                <rect x="1" y="1" width="19.383" height="19.383" rx="4" stroke="#999" strokeWidth="2"></rect>
                <path d="M7.991 16.06l-3.99-3.992 1.43-1.432 2.491 2.49L15.31 5l1.498 1.363L7.99 16.06z" fill="#999"></path>
                <rect x="29" y="62" width="89" height="8" rx="4" fill="#999"></rect>
                <rect x="29" y="75" width="40" height="8" rx="4" fill="#999"></rect>
                <rect x="1" y="63" width="19.383" height="19.383" rx="4" stroke="#999" strokeWidth="2"></rect>
                <path d="M7.991 78.06l-3.99-3.992 1.43-1.432 2.491 2.49L15.31 67l1.498 1.363L7.99 78.06z" fill="#999"></path>
                <rect x="29" y="31" width="107" height="8" rx="4" fill="#999"></rect>
                <rect x="29" y="44" width="52" height="8" rx="4" fill="#999"></rect>
                <rect x="1" y="32" width="19.383" height="19.383" rx="4" stroke="#999" strokeWidth="2"></rect>
            </svg>
            <h1 className="pt-4 text-xl">No tasks to display</h1>
            <p className="pt-2 text-lg" style={{color: "grey"}}>Tasks that have a due date will show up here.</p>
        </div>
    );
}

export default EmptyTaskSVG;