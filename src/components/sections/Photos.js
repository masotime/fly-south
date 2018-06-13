/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';

function Photos({ media = [] }) {
	return (
		<Fragment>
			{
				media
					.filter(item => item.type === 'photo')
					.map(item => <img className="photo" key={item.id} src={item.media_url} />)
			}
		</Fragment>
	);
}

export default Photos;