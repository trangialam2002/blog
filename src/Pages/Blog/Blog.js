import LeftBlog from "./ComponentBlog/LeftBlog/LeftBlog";
import RightBlog from "./ComponentBlog/RightBlog/RightBlog";
import './blog.css'
function Blog() {
    return ( 
        <div className="color">
	 		<div className="tintuc">
                <LeftBlog/>
                <RightBlog/>
            </div>
        </div>
     );
}

export default Blog;