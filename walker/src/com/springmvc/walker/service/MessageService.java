package com.springmvc.walker.service;

import java.util.List;
import java.util.Map;

import com.springmvc.framework.entity.Page;

public interface MessageService {
	
	public List<Map<String, Object>> getMessagePage(Map<String, Object> paraMap, Page page);

	public boolean saveMessage(Map<String, Object> userMap);
	
	public boolean deleteMessage(String ids);
	
	public Map<String, Object> getMessageById(String id);
	
	public List<Map<String, Object>> getMessageByIds(String ids);
}
