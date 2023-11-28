import { useEffect, useState, useContext } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom'


import * as commentService from '../../services/commentService';
import * as placeService from '../../services/placeService';
import AuthContext from "../../contexts/AuthContext";

import AddComment from './AddComment/AddComment';
import DeletePlace from './DeletePlace/DeletePlace';

export default function Details() {
  const { email, userId, isAuthenticated } = useContext(AuthContext);
  const { placeId } = useParams();
  const [place, setPlace] = useState({});
  const [showDelete, setShowDelete] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      placeService.getOne(placeId),
      commentService.getAll(placeId),
    ])
      .then(([placeData, comments]) => {
        setPlace({
          ...placeData,
          comments,
        });
      });
  }, [placeId]);

  const onCommentSubmit = async (values) => {
    const newComment = await commentService.create(placeId, values.comment);
    console.log(newComment);

    setPlace(state => ({
      ...state,
      comments: [...state.comments,
      {
        ...newComment,
        author: {
          email
        }
      }],
    }))
  }
  const isOwner = place._ownerId === userId;
  //console.log(userId);
  //console.log(place._ownerId)

  const onDeleteClick = async () => {
    setShowDelete(true);
  }
  const deletePlaceHandler = async () => {
    console.log("ok")
    await placeService.deletePlace(placeId);
        navigate('/dashboard');
  }

  return (
    <>
      {showDelete && (
        <DeletePlace
          onClose={() => setShowDelete(false)}
          onDelete={deletePlaceHandler}
        />
      )}
      <section id="details">
        <div id="details-wrapper">
          <div className="basic">
            <p id="details-name">{place.name}</p>
            <img id="details-img" src={place.imageUrl} />
            <p id="location">Location: {`${place.location}`}</p>
          </div>
          <div id="info-wrapper">
            <div id="details-description">

              <p id="description">
                {place.description}
              </p>
              <p id="more-info">
                {place.additionalInfo}
              </p>
            </div>
          </div>

          <div id="action-buttons">
            {isOwner && (
              <>
                <Link to={`/dashboard/${place._id}/edit`} id="edit-btn">Edit</Link>
                <button onClick={onDeleteClick}
                  id="delete-btn">Delete</button>
              </>
            )}
          </div>
        </div>

        <aside>
          <div id="comments">
            <h3>Comments:</h3>
            <ul>
              {place.comments && place.comments.map(({_id, comment, owner:{email} }) => (
                <li key={_id} >
                  <p>{email}:{comment}</p>
                </li>
              ))}
            </ul>
            {!place.comments?.length && (
              <p>No comments yet</p>
            )}
            {isAuthenticated && <AddComment onCommentSubmit={onCommentSubmit} />}
          </div>
        </aside>
      </section>
    </>
  )
}
