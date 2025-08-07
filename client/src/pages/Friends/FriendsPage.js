import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Button,
  Chip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Badge,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Message as MessageIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFriends,
  fetchFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  clearError,
  clearSuccess
} from '../../store/slices/friendsSlice';
import { createConversation } from '../../store/slices/messagesSlice';
import { formatError } from '../../utils/errorHandler';

const FriendsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddFriendDialog, setShowAddFriendDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [emailToAdd, setEmailToAdd] = useState('');

  const dispatch = useDispatch();
  const { friends, requests, loading, error, success } = useSelector(state => state.friends);

  useEffect(() => {
    dispatch(fetchFriends());
    dispatch(fetchFriendRequests());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFriendUpdate = async (updatedFriend) => {
    try {
      console.log('Mise à jour de l\'ami:', updatedFriend);
      // Logique de mise à jour
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'ami:', error);
    }
  };

  const handleSendFriendRequest = async (userId) => {
    if (emailToAdd.trim()) {
      try {
        await dispatch(sendFriendRequest(emailToAdd.trim())).unwrap();
        setEmailToAdd('');
        setShowAddFriendDialog(false);
      } catch (error) {
        console.error('Erreur lors de l\'envoi de la demande:', error);
      }
    }
  };

  const handleAcceptRequest = async (requestId) => {
    await dispatch(acceptFriendRequest(requestId));
  };

  const handleRejectRequest = async (requestId) => {
    await dispatch(rejectFriendRequest(requestId));
  };

  const handleRemoveFriend = async (friendId) => {
    await dispatch(removeFriend(friendId));
  };

  const handleSendMessage = async () => {
    if (messageText.trim() && selectedFriend) {
      try {
        // Créer une conversation avec l'ami
        const conversation = await dispatch(createConversation({
          participants: [selectedFriend._id],
          name: `${selectedFriend.firstName} ${selectedFriend.lastName}`,
          type: 'private'
        })).unwrap();
        
        // Envoyer le message dans la conversation créée
        if (conversation && conversation._id) {
          // Ici on pourrait ajouter l'envoi du message
          // await dispatch(sendMessage({
          //   conversationId: conversation._id,
          //   content: messageText.trim()
          // }));
        }
        
        setMessageText('');
        setShowMessageDialog(false);
        setSelectedFriend(null);
      } catch (error) {
        console.error('Erreur lors de la création de la conversation:', error);
      }
    }
  };

  const openMessageDialog = (friend) => {
    setSelectedFriend(friend);
    setShowMessageDialog(true);
  };

  const filteredFriends = (friends || []).filter(friend =>
    friend.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRequests = (requests || []).filter(request =>
    request.requester.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.requester.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        👥 Mes Amis
      </Typography>

      {/* Messages d'erreur/succès */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
          {formatError(error)}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => dispatch(clearSuccess())}>
          {typeof success === 'string' ? success : 'Opération réussie'}
        </Alert>
      )}

      {/* Barre d'outils */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Rechercher des amis..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ flex: 1 }}
        />
        
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => setShowAddFriendDialog(true)}
        >
          Ajouter un ami
        </Button>
      </Box>

      {/* Onglets */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Mes Amis
                <Badge badgeContent={friends?.length || 0} color="primary" />
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Demandes
                <Badge badgeContent={requests?.length || 0} color="error" />
              </Box>
            } 
          />
        </Tabs>
      </Box>

      {/* Contenu des onglets */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Onglet Mes Amis */}
          {activeTab === 0 && (
            <Paper>
              {filteredFriends.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Aucun ami trouvé
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {searchQuery ? 'Aucun ami ne correspond à votre recherche.' : 'Vous n\'avez pas encore d\'amis. Commencez par ajouter des personnes !'}
                  </Typography>
                </Box>
              ) : (
                <List>
                  {filteredFriends.filter(friend => friend && friend.firstName).map((friend, index) => (
                    <Box key={`friend-${friend._id}-${friend.email || Date.now()}-${index}`}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar src={friend.profilePicture}>
                            {friend.firstName?.charAt(0) || 'U'}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${friend.firstName} ${friend.lastName}`}
                          secondary={friend.email}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleRemoveFriend(friend._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </Box>
                  ))}
                </List>
              )}
            </Paper>
          )}

          {/* Onglet Demandes */}
          {activeTab === 1 && (
            <Paper>
              {filteredRequests.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Aucune demande d'ami
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {searchQuery ? 'Aucune demande ne correspond à votre recherche.' : 'Vous n\'avez pas de demandes d\'ami en attente.'}
                  </Typography>
                </Box>
              ) : (
                <List>
                  {filteredRequests.filter(request => request && request.from).map((request) => (
                    <Box key={request._id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar src={request.from.profilePicture}>
                            {request.from.firstName?.charAt(0) || 'U'}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${request.from.firstName} ${request.from.lastName}`}
                          secondary={`Demande d'ami de ${request.from.email}`}
                        />
                        <ListItemSecondaryAction>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              onClick={() => handleAcceptRequest(request._id)}
                            >
                              Accepter
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleRejectRequest(request._id)}
                            >
                              Refuser
                            </Button>
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </Box>
                  ))}
                </List>
              )}
            </Paper>
          )}
        </>
      )}

      {/* Dialog Ajouter un ami */}
      <Dialog open={showAddFriendDialog} onClose={() => setShowAddFriendDialog(false)}>
        <DialogTitle>Ajouter un ami</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email de l'ami"
            type="email"
            fullWidth
            variant="outlined"
            value={emailToAdd}
            onChange={(e) => setEmailToAdd(e.target.value)}
            placeholder="exemple@email.com"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddFriendDialog(false)}>Annuler</Button>
          <Button 
            onClick={handleSendFriendRequest} 
            variant="contained"
            disabled={!emailToAdd.trim() || loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Envoi...' : 'Envoyer la demande'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Envoyer un message */}
      <Dialog 
        open={showMessageDialog} 
        onClose={() => setShowMessageDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Message à {selectedFriend?.firstName} {selectedFriend?.lastName}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Votre message"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Tapez votre message..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMessageDialog(false)}>Annuler</Button>
          <Button 
            onClick={handleSendMessage} 
            variant="contained"
            disabled={!messageText.trim() || loading}
            startIcon={loading ? <CircularProgress size={20} /> : <MessageIcon />}
          >
            {loading ? 'Envoi...' : 'Envoyer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FriendsPage; 