import React from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  Typography,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';

const MessageContainer = styled(Box)(({ theme, isOwn }) => ({
  display: 'flex',
  justifyContent: isOwn ? 'flex-end' : 'flex-start',
  marginBottom: theme.spacing(1),
}));

const MessageBubble = styled(Paper)(({ theme, isOwn }) => ({
  maxWidth: '70%',
  padding: theme.spacing(1, 2),
  backgroundColor: isOwn ? theme.palette.primary.main : theme.palette.grey[100],
  color: isOwn ? theme.palette.primary.contrastText : theme.palette.text.primary,
  borderRadius: theme.spacing(2),
  wordWrap: 'break-word',
}));

const MessageList = ({ messages = [], currentUserId, loading = false, error = null }) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isOwnMessage = (message) => {
    return message.sender?._id === currentUserId;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', overflow: 'auto', p: 2 }}>
      {messages.length === 0 ? (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            color: 'text.secondary'
          }}
        >
          <Typography variant="body2">
            Aucun message pour le moment. Commencez la conversation !
          </Typography>
        </Box>
      ) : (
        <List sx={{ p: 0 }}>
          {messages.filter(message => message && message.content).map((message, index) => (
            <MessageBubble
              key={`message-${message._id || message.id || index}-${message.createdAt || Date.now()}-${index}`}
              message={message}
              isOwnMessage={message.senderId === currentUserId}
              onReply={handleReply}
              onReact={handleReaction}
            />
          ))}
        </List>
      )}
    </Box>
  );
};

export default MessageList; 