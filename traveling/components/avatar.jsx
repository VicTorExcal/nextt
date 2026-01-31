"use client";

import { useState, useEffect } from "react";
function Avatar({user, onClick}) {
    const [avatarUrl, setAvatarUrl] = useState();

    useEffect(() => {
        if (!user || !user.avatar_usuario) return;
        const avatar = user.avatar_usuario
        try {
            const splitAvatar = avatar.split(" ");

            if (splitAvatar.length > 1) {
            const InitialName = splitAvatar[0];
            const Background = splitAvatar[1];
            const url = `https://ui-avatars.com/api/?name=${InitialName}&background=${Background}`;
            setAvatarUrl(url);
            } else {
            setAvatarUrl(avatar);
            }
        } catch (err) {
            console.error("Error avatar:", err);
            setAvatarUrl("/avatarDefault.png");
        }
    }, [user]);
  return (
    <>
        <img
            src={avatarUrl || "/avatarDefault.png"}
            onClick={onClick}
            className={`
                w-12 h-12 p-0.5 rounded-full opacity-70 bg-gray-400 md:w-12 md:h-12
                hover:cursor-pointer
                ${user && 'hover:bg-white hover:border hover:border-gray-400'} 
            `}
        />
    </>
  )}
  export default Avatar;