import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import noImg from '../assets/noImg.png';
import { useHistory } from "react-router";
import { FiX } from "react-icons/fi/index.esm.js";
import { CurrentUserContext } from "../all-contexts/currentUserContext.js";

const FollowersModal = ({ isOpen, onClose, userIds, title }) => {
    const [usersData, setUsersData] = useState([]);
    const [loadingStatus, setLoadingStatus] = useState("loading");
    const history = useHistory();
    const { usuarioActual } = useContext(CurrentUserContext);

    useEffect(() => {
        if (!isOpen || !userIds || userIds.length === 0) {
            setUsersData([]);
            setLoadingStatus("idle");
            return;
        }

        setLoadingStatus("loading");
        
        // Obtener todos los usuarios en la lista
        const fetchUsers = async () => {
            try {
                const users = await Promise.all(
                    userIds.map(userId =>
                        fetch(`/users/${userId}`)
                            .then(res => {
                                if (!res.ok) throw new Error(`Error fetching user ${userId}`);
                                return res.json();
                            })
                            .then(data => data.user || null)
                            .catch(err => {
                                console.warn(`Error fetching user ${userId}:`, err);
                                return null;
                            })
                    )
                );
                setUsersData(users.filter(user => user !== null && user !== undefined));
                setLoadingStatus("idle");
            } catch (err) {
                console.warn('Error fetching users:', err);
                setUsersData([]);
                setLoadingStatus("idle");
            }
        };

        fetchUsers();
    }, [isOpen, userIds]);

    const handleUserProfile = (userId) => {
        history.push(`/profile/${userId}`);
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <Overlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>{title}</ModalTitle>
                    <CloseButton onClick={onClose}>
                        <FiX size={24} />
                    </CloseButton>
                </ModalHeader>
                <UsersContainer>
                    {loadingStatus === "loading" ? (
                        <LoadingText>Cargando...</LoadingText>
                    ) : usersData.length === 0 ? (
                        <EmptyText>No hay usuarios</EmptyText>
                    ) : (
                        usersData
                            .filter(user => user !== null && user !== undefined && user._id)
                            .map((user) => (
                            <UserCard key={user._id} onClick={() => handleUserProfile(user._id)}>
                                <UserProfileImg
                                    style={{
                                        backgroundImage: `url(${user.imgSrc !== '' ? user.imgSrc : noImg})`
                                    }}
                                />
                                <UserInfo>
                                    <UserName>
                                        {user.displayName}
                                        {usuarioActual && usuarioActual._id === user._id && <YouLabel> (Tú)</YouLabel>}
                                    </UserName>
                                    <UserBio>{user.bio}</UserBio>
                                </UserInfo>
                            </UserCard>
                        ))
                    )}
                </UsersContainer>
            </ModalContent>
        </Overlay>
    );
};

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background-color: #2C3E50;
    border-radius: 10px;
    max-width: 500px;
    width: 90%;
    max-height: 70vh;
    display: flex;
    flex-direction: column;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #3C4552;
`;

const ModalTitle = styled.h2`
    margin: 0;
    color: #FFFFFF;
    font-size: 1.5rem;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    color: #FFFFFF;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    border-radius: 50%;
    transition: background-color 0.2s;

    &:hover {
        background-color: rgba(238, 108, 77, 0.2);
    }
`;

const UsersContainer = styled.div`
    overflow-y: auto;
    padding: 10px;
    flex: 1;

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: #3C4552;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
        background: #00C258;
        border-radius: 10px;

        &:hover {
            background: #E85A3D;
        }
    }
`;

const UserCard = styled.div`
    display: flex;
    align-items: center;
    padding: 12px;
    margin-bottom: 10px;
    background-color: #3C4552;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px;

    &:hover {
        background-color: #495563;
        transform: translateX(5px);
        box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 8px;
    }
`;

const UserProfileImg = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    margin-right: 15px;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px;
`;

const UserInfo = styled.div`
    flex: 1;
`;

const UserName = styled.div`
    color: #FFFFFF;
    font-weight: bold;
    font-size: 0.95rem;
    margin-bottom: 4px;
`;

const YouLabel = styled.span`
    color: #00C258;
    font-size: 0.85rem;
    margin-left: 6px;
    font-weight: normal;
`;

const UserBio = styled.div`
    color: #B0BCC4;
    font-size: 0.85rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const LoadingText = styled.div`
    color: #FFFFFF;
    text-align: center;
    padding: 40px 20px;
`;

const EmptyText = styled.div`
    color: #B0BCC4;
    text-align: center;
    padding: 40px 20px;
`;

export default FollowersModal;

